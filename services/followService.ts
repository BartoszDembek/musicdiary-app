import axios from 'axios';
const API_URL = 'https://musicdiary-backend-puce.vercel.app'

export const followService = {
    followArtist: async (userId: string, artistId: string, artistName?: string) => {
        try {
            const url = `${API_URL}/follows/follow-artist/${userId}?artistId=${artistId}`;
            const body: { artistName?: string } = {};
            if (artistName) body.artistName = artistName;
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
    },

    followUser: async (userId: string, targetUserId: string, targetUsername?: string) => {
        try {
            const url = `${API_URL}/follows/follow-user/${userId}?targetUserId=${targetUserId}`;
            const body: { targetUserName?: string } = {};
            if (targetUsername) body.targetUserName = targetUsername;
            const response = await axios.post(url, body);
            return response.data;
        } catch (error) {
            if (error.response) {
              throw new Error(error.response.data.message || 'Nie udało się zaobserwować użytkownika');
            } else if (error.request) {
              throw new Error('Brak odpowiedzi od serwera');
            } else {
              throw new Error('Błąd podczas wysyłania żądania');
            }
        }
    },

    unfollowUser: async (userId: string, targetUserId: string) => {
        try {
            const response = await axios.post(`${API_URL}/follows/unfollow-user/${userId}?targetUserId=${targetUserId}`);
            return response.data;
        } catch (error) {
            if (error.response) {
              throw new Error(error.response.data.message || 'Nie udało się przestać obserwować użytkownika');
            } else if (error.request) {
              throw new Error('Brak odpowiedzi od serwera');
            } else {
              throw new Error('Błąd podczas wysyłania żądania');
            }
        }
    }
};