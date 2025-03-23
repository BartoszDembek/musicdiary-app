import axios from 'axios';
const API_URL = 'https://musicdiary-backend-puce.vercel.app'

export const followService = {
    followArtist: async (userId: string, artistId: string) => {
        try {
            const response = await axios.post(`${API_URL}/follows/follow-artist/${userId}?artistId=${artistId}`);
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

    unfollowArtist: async (userId: string, artistId: string) => {
        try {
            const response = await axios.post(`${API_URL}/follows/unfollow-artist/${userId}?artistId=${artistId}`);
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
    }
};