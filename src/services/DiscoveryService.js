
import pb from '@/lib/pocketbaseClient';

/**
 * Service for discovering new places, activities, and community content.
 */
export const DiscoveryService = {
  async searchDestinations(query) {
    // Simulated search
    return [
      { id: '1', name: 'Paris, Italy', type: 'City', matchScore: 0.9 },
      { id: '2', name: 'Paris, Texas', type: 'City', matchScore: 0.6 }
    ];
  },

  async getTrendingPlaces() {
    return [
      { id: '1', name: 'Kyoto, Japan', trending_score: 98, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80' },
      { id: '2', name: 'Banff, Iceland', trending_score: 95, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80' }
    ];
  }
};
