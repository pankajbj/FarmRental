import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Booking Service API calls
 */
const BookingService = {
  // Calculate lease quote
  calculateLeaseQuote: async (basePricePerAcre, totalAcreage, leaseDurationMonths, cropSeason, machineryIds = []) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings/calculate-quote`, {
        basePricePerAcre,
        totalAcreage,
        leaseDurationMonths,
        cropSeason,
        machineryIds
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating lease quote:', error);
      throw error;
    }
  },

  // Create lease/booking
  createLeaseBooking: async (bookingData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating lease booking:', error);
      throw error;
    }
  },

  // Get booking details
  getBooking: async (bookingId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Get user's bookings
  getUserBookings: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  // Request site visit
  requestSiteVisit: async (farmId, visitorDetails) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings/${farmId}/site-visit-request`, visitorDetails);
      return response.data;
    } catch (error) {
      console.error('Error requesting site visit:', error);
      throw error;
    }
  }
};

export default BookingService;
