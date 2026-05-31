import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Mobile Farm Service
 */
const MobileFarmService = {
  // Get nearby farms
  getNearbyFarms: async (latitude, longitude, radiusKm = 50) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/farms/search/location`, {
        params: { latitude, longitude, radiusKm }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby farms:', error);
      throw error;
    }
  },

  // Get all active farms
  getActiveFarms: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/farms/status/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active farms:', error);
      throw error;
    }
  },

  // Get farm detail
  getFarmDetail: async (farmId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/farms/${farmId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching farm detail:', error);
      throw error;
    }
  },

  // Request site visit
  requestSiteVisit: async (farmId, visitorName, visitorPhone, preferredDate) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings/${farmId}/site-visit-request`, {
        visitorName,
        visitorPhone,
        preferredDate,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error requesting site visit:', error);
      throw error;
    }
  },

  // Search by filters
  searchFarms: async (filters) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/farms/search`, filters);
      return response.data;
    } catch (error) {
      console.error('Error searching farms:', error);
      throw error;
    }
  }
};

export default MobileFarmService;
