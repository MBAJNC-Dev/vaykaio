import supabase from '@/lib/supabaseClient.js';

const DEFAULT_ROUTINES = [
  {
    name: 'Breakfast',
    start_time: '08:00',
    duration_minutes: 60,
    category: 'meal',
    description: 'Daily breakfast',
  },
  {
    name: 'Lunch',
    start_time: '12:00',
    duration_minutes: 60,
    category: 'meal',
    description: 'Daily lunch',
  },
  {
    name: 'Dinner',
    start_time: '19:00',
    duration_minutes: 90,
    category: 'meal',
    description: 'Daily dinner',
  },
  {
    name: 'Morning Workout',
    start_time: '06:30',
    duration_minutes: 60,
    category: 'activity',
    description: 'Morning exercise routine',
  },
  {
    name: 'Evening Walk',
    start_time: '18:00',
    duration_minutes: 30,
    category: 'activity',
    description: 'Evening relaxation walk',
  },
];

const RoutineService = {
  // Get routine templates for a user
  async getRoutineTemplates(userId) {
    try {
      const { data, error } = await supabase
        .from('routine_templates')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch routine templates for user ${userId}:`, error);
      throw error;
    }
  },

  // Create a new routine template
  async createRoutineTemplate(data, userId) {
    try {
      if (!userId) throw new Error('Not authenticated');

      const { data: routine, error } = await supabase
        .from('routine_templates')
        .insert({
          ...data,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return routine;
    } catch (error) {
      console.error('Failed to create routine template:', error);
      throw error;
    }
  },

  // Update a routine template
  async updateRoutineTemplate(id, data) {
    try {
      const { data: routine, error } = await supabase
        .from('routine_templates')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return routine;
    } catch (error) {
      console.error(`Failed to update routine template ${id}:`, error);
      throw error;
    }
  },

  // Delete a routine template
  async deleteRoutineTemplate(id) {
    try {
      const { error } = await supabase
        .from('routine_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Failed to delete routine template ${id}:`, error);
      throw error;
    }
  },

  // Apply a routine template across all days of a trip
  async applyRoutineToTrip(tripId, routineId) {
    try {
      // Get the routine template
      const { data: routine, error: routineError } = await supabase
        .from('routine_templates')
        .select('*')
        .eq('id', routineId)
        .single();

      if (routineError) throw routineError;

      // Get all days in the trip
      const { data: days, error: daysError } = await supabase
        .from('itinerary_days')
        .select('id')
        .eq('trip_id', tripId);

      if (daysError) throw daysError;

      // Create itinerary items for each day
      const createdItems = [];
      for (const day of days || []) {
        const { data: item, error: itemError } = await supabase
          .from('itinerary_items')
          .insert({
            day_id: day.id,
            title: routine.name,
            description: routine.description,
            type: routine.category,
            start_time: routine.start_time,
            duration_minutes: routine.duration_minutes,
            status: 'planned',
          })
          .select()
          .single();

        if (itemError) throw itemError;
        createdItems.push(item);
      }

      return createdItems;
    } catch (error) {
      console.error(`Failed to apply routine ${routineId} to trip ${tripId}:`, error);
      throw error;
    }
  },

  // Return sensible default routines
  getDefaultRoutines() {
    return DEFAULT_ROUTINES;
  },
};

export default RoutineService;
