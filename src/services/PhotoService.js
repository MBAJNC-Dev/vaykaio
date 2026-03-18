import supabase from '@/lib/supabaseClient.js';

const PhotoService = {
  // Get photos for a trip with optional filters
  async getPhotos(tripId, options = {}) {
    try {
      const { day, location, tags } = options;

      let query = supabase
        .from('photos')
        .select('*')
        .eq('trip_id', tripId);

      if (day) {
        query = query.eq('day', day);
      }

      if (location) {
        query = query.eq('location_id', location);
      }

      if (tags && tags.length > 0) {
        // Filter by tags (assumes tags is a JSONB array field)
        for (const tag of tags) {
          query = query.contains('tags', [tag]);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch photos for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Upload a photo with metadata
  async uploadPhoto(tripId, file, metadata = {}, userId) {
    try {
      if (!userId) throw new Error('Not authenticated');

      // Upload file to storage
      const fileName = `${tripId}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('trip-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create photo record
      const { data: photo, error: photoError } = await supabase
        .from('photos')
        .insert({
          trip_id: tripId,
          uploaded_by: userId,
          title: metadata.title || file.name,
          description: metadata.description || '',
          day: metadata.day || null,
          location_id: metadata.location || null,
          tags: metadata.tags || [],
          latitude: metadata.latitude || null,
          longitude: metadata.longitude || null,
          file_path: uploadData.path,
        })
        .select()
        .single();

      if (photoError) throw photoError;
      return photo;
    } catch (error) {
      console.error('Failed to upload photo:', error);
      throw error;
    }
  },

  // Delete a photo
  async deletePhoto(photoId) {
    try {
      // Get photo to get file path
      const { data: photo, error: fetchError } = await supabase
        .from('photos')
        .select('file_path')
        .eq('id', photoId)
        .single();

      if (fetchError) throw fetchError;

      // Delete file from storage
      if (photo.file_path) {
        const { error: storageError } = await supabase.storage
          .from('trip-photos')
          .remove([photo.file_path]);

        if (storageError) throw storageError;
      }

      // Delete photo record
      const { error: deleteError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (deleteError) throw deleteError;
      return { success: true };
    } catch (error) {
      console.error(`Failed to delete photo ${photoId}:`, error);
      throw error;
    }
  },

  // Update photo metadata
  async updatePhotoMetadata(photoId, data) {
    try {
      const { data: photo, error } = await supabase
        .from('photos')
        .update({
          title: data.title,
          description: data.description,
          tags: data.tags || [],
          location_id: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
        })
        .eq('id', photoId)
        .select()
        .single();

      if (error) throw error;
      return photo;
    } catch (error) {
      console.error(`Failed to update photo ${photoId} metadata:`, error);
      throw error;
    }
  },

  // Get photos from a specific day
  async getPhotosByDay(tripId, dayNumber) {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('trip_id', tripId)
        .eq('day', dayNumber)
        .order('created_at');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(
        `Failed to fetch photos for trip ${tripId} day ${dayNumber}:`,
        error
      );
      throw error;
    }
  },

  // Get photos by location
  async getPhotosByLocation(tripId, locationId) {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('trip_id', tripId)
        .eq('location_id', locationId)
        .order('created_at');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(
        `Failed to fetch photos for trip ${tripId} location ${locationId}:`,
        error
      );
      throw error;
    }
  },

  // Get memory timeline organized by day with summaries
  async getMemoryTimeline(tripId) {
    try {
      const { data: photos, error } = await supabase
        .from('photos')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at');

      if (error) throw error;

      // Organize by day
      const timeline = {};

      (photos || []).forEach(photo => {
        const day = photo.day || 'undated';
        if (!timeline[day]) {
          timeline[day] = {
            day,
            photos: [],
            summary: '',
          };
        }
        timeline[day].photos.push(photo);
      });

      return timeline;
    } catch (error) {
      console.error(`Failed to fetch memory timeline for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Create an album (collection of photos)
  async createAlbum(tripId, name, photoIds = []) {
    try {
      const { data, error } = await supabase
        .from('albums')
        .insert({
          trip_id: tripId,
          name,
          photo_ids: photoIds,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Failed to create album for trip ${tripId}:`, error);
      throw error;
    }
  },

  // Get all albums for a trip
  async getAlbums(tripId) {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('trip_id', tripId)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch albums for trip ${tripId}:`, error);
      throw error;
    }
  },
};

export default PhotoService;
