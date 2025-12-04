import axios from 'axios';
const API_URL = 'https://musicdiary-backend-puce.vercel.app'

export const favoriteService = {
    addFavorite: async (userId: string, trackId: string, artistName?: string, albumName?: string, type?: string) => {
        try {
            const url = `${API_URL}/favorites/add/${userId}?id=${trackId}`;
            const body: { artistName?: string; albumName?: string; type?: string } = {};
            if (artistName) body.artistName = artistName;
            if (albumName) body.albumName = albumName;
            if (type) body.type = type;
            const response = await axios.post(url, body);
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

    removeFavorite: async (userId: string, trackId: string) => {
        try {
            const response = await axios.post(`${API_URL}/favorites/remove/${userId}?id=${trackId}`);
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