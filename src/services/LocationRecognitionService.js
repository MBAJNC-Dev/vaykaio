
/**
 * Service for handling location data, reverse geocoding, and EXIF GPS extraction.
 */
export const LocationRecognitionService = {
  /**
   * Reverse geocodes coordinates to a readable location string.
   * Currently stubbed for frontend demonstration.
   * @param {number} lat 
   * @param {number} lng 
   * @returns {Promise<Object>}
   */
  reverseGeocode: async (lat, lng) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Stubbed response - in production, call OpenCageData or Google Maps API
    return {
      country: "France",
      city: "Paris",
      landmark: "Eiffel Tower Area",
      formatted: "Paris, France",
      confidence: 0.95
    };
  },

  /**
   * Formats raw EXIF GPS data into standard decimal coordinates.
   * @param {Object} exifData 
   * @returns {Object|null} { lat, lng }
   */
  parseExifGPS: (exifData) => {
    if (!exifData || !exifData.latitude || !exifData.longitude) return null;
    return {
      lat: exifData.latitude,
      lng: exifData.longitude
    };
  }
};
