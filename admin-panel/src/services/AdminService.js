import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Admin Service API calls
 */
const AdminService = {
  // Get pending verifications
  getPendingVerifications: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/verifications/pending`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
      throw error;
    }
  },

  // Submit verification
  submitVerification: async (verificationData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/verifications/submit`,
        verificationData
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting verification:', error);
      throw error;
    }
  },

  // Get verification details
  getVerificationDetails: async (farmId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/verifications/${farmId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching verification details:', error);
      throw error;
    }
  },

  // Get all farms for moderation
  getAllFarmsForModeration: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/farms/moderation`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching farms for moderation:', error);
      throw error;
    }
  },

  // Get user statistics
  getUserStatistics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/statistics/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  },

  // Get booking statistics
  getBookingStatistics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/statistics/bookings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking statistics:', error);
      throw error;
    }
  }
};

export default AdminService;
