import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Farm Service API calls
 */
const FarmService = {
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

  // Get farm by ID
  getFarmById: async (farmId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/farms/${farmId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching farm:', error);
      throw error;
    }
  },

  // Search farms by location
  searchFarmsByLocation: async (latitude, longitude, radiusKm = 50) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/farms/search/location`, {
        params: { latitude, longitude, radiusKm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching farms by location:', error);
      throw error;
    }
  },

  // Search farms by acreage
  searchByAcreage: async (minAcreage, maxAcreage) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/farms/search/acreage`, {
        params: { minAcreage, maxAcreage }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching farms by acreage:', error);
      throw error;
    }
  },

  // Search farms by soil type
  searchBySoilType: async (soilType) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/farms/search/soil-type`, {
        params: { soilType }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching farms by soil type:', error);
      throw error;
    }
  },

  // Create new farm listing
  createFarmListing: async (farmData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/farms`, farmData);
      return response.data;
    } catch (error) {
      console.error('Error creating farm listing:', error);
      throw error;
    }
  },

  // Update farm listing
  updateFarmListing: async (farmId, farmData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/farms/${farmId}`, farmData);
      return response.data;
    } catch (error) {
      console.error('Error updating farm listing:', error);
      throw error;
    }
  },

  // Delete farm listing
  deleteFarmListing: async (farmId) => {
    try {
      await axios.delete(`${API_BASE_URL}/farms/${farmId}`);
    } catch (error) {
      console.error('Error deleting farm listing:', error);
      throw error;
    }
  },

  // Get farms by owner
  getFarmsByOwner: async (ownerId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/farms/owner/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching owner farms:', error);
      throw error;
    }
  }
};

export default FarmService;
