
import apiServerClient from '@/lib/apiServerClient';

/**
 * Service for interacting with the AI Photo Recognition backend endpoints.
 * Integrates with Google Vision API, AWS Rekognition, etc. via the backend.
 */
export const AIRecognitionService = {
  /**
   * Analyzes a single photo using the backend AI service.
   * @param {File|string} photo - File object or PocketBase URL
   * @param {Array<string>} analysisTypes - e.g., ['labels', 'faces', 'text', 'quality', 'nsfw']
   * @returns {Promise<Object>} Analysis results
   */
  analyzePhoto: async (photo, analysisTypes = ['labels', 'faces', 'quality', 'nsfw']) => {
    try {
      let response;
      
      if (photo instanceof File) {
        const formData = new FormData();
        formData.append('file', photo);
        formData.append('analysisTypes', JSON.stringify(analysisTypes));
        
        response = await apiServerClient.fetch('/ai/recognize-photo', {
          method: 'POST',
          body: formData,
        });
      } else if (typeof photo === 'string') {
        response = await apiServerClient.fetch('/ai/recognize-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            photoUrl: photo,
            analysisTypes
          }),
        });
      } else {
        throw new Error('Invalid photo input type');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze photo');
      }

      return await response.json();
    } catch (error) {
      console.error('AIRecognitionService error:', error);
      throw error;
    }
  },

  /**
   * Analyzes multiple photos in batch.
   * @param {Array<File>} files - Array of File objects
   * @param {Array<string>} analysisTypes 
   */
  batchAnalyze: async (files, analysisTypes = ['labels', 'quality']) => {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('analysisTypes', JSON.stringify(analysisTypes));

      const response = await apiServerClient.fetch('/ai/batch-recognize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Batch analysis failed');
      return await response.json();
    } catch (error) {
      console.error('Batch analysis error:', error);
      throw error;
    }
  }
};
