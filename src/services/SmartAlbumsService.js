
import pb from '@/lib/pocketbaseClient';

export const SmartAlbumsService = {
  /**
   * Creates a new album
   */
  createAlbum: async (data) => {
    return await pb.collection('albums').create(data, { $autoCancel: false });
  },

  /**
   * Fetches albums for a user or family group
   */
  getAlbums: async (userId, familyGroupId = null) => {
    let filter = `user_id = "${userId}"`;
    if (familyGroupId) {
      filter = `(${filter} || family_group_id = "${familyGroupId}")`;
    }
    
    return await pb.collection('albums').getFullList({
      filter,
      sort: '-created',
      $autoCancel: false
    });
  },

  /**
   * Auto-groups photos into smart albums based on time and location
   * @param {Array} photos 
   * @returns {Array} Suggested albums
   */
  generateSmartSuggestions: (photos) => {
    // Stubbed logic: group by date (simplified)
    const groups = {};
    photos.forEach(photo => {
      if (!photo.created) return;
      const date = new Date(photo.created).toISOString().split('T')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(photo);
    });

    return Object.entries(groups).map(([date, items]) => ({
      name: `Trip on ${date}`,
      description: `Auto-generated album for ${date}`,
      photos: items.map(i => i.id),
      cover_photo_id: items[0]?.id,
      album_type: 'smart'
    }));
  }
};
