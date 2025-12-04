import axios from 'axios';
const API_URL = 'https://musicdiary-backend-puce.vercel.app'

export const userService = {
    getUserProfile: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            if (error.response) {
              throw new Error(error.response.data.message || 'Failed to fetch user profile');
            } else if (error.request) {
              throw new Error('No response from server');
            } else {
              throw new Error('Request failed');
            }
        }
    },

    updateProfile: async (userId, profileData) => {
        try {
            const response = await axios.put(`${API_URL}/user/${userId}`, profileData);
            return response.data;
        } catch (error) {
            if (error.response) {
              throw new Error(error.response.data.message || 'Failed to update profile');
            } else if (error.request) {
              throw new Error('No response from server');
            } else {
              throw new Error('Request failed');
            }
        }
    },

    getFollowerInfo: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/user/follower-info/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching follower info:', error);
            return null;
        }
    }
};