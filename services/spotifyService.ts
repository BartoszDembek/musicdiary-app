import axios from 'axios';
const API_URL = 'https://musicdiary-backend-puce.vercel.app'
export const spotifyService = {
    loadAlbums: async () => {
      try {
        const response = await axios.get(`${API_URL}/spotify/newReleases`);
        return response.data;
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data.message || 'Błąd pobrania albumów');
        } else if (error.request) {
          throw new Error('Brak odpowiedzi od serwera');
        } else {
          throw new Error('Błąd podczas wysyłania żądania');
        }
      }
    },
    getAlbumByID: async (id) => {
      try {
        const response = await axios.get(`${API_URL}/spotify/album/${id}`);
        return response.data;
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data.message || 'Błąd pobrania albumu');
        } else if (error.request) {
          throw new Error('Brak odpowiedzi od serwera');
        } else {
          throw new Error('Błąd podczas wysyłania żądania');
        }
      }
    },
    getArtistByID: async (id) => {
      try {
        const response = await axios.get(`${API_URL}/spotify/artist/${id}`);
        return response.data;
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data.message || 'Błąd pobrania artysty');
        } else if (error.request) {
          throw new Error('Brak odpowiedzi od serwera');
        } else {
          throw new Error('Błąd podczas wysyłania żądania');
        }
      }
    },
    getArtistAlbums: async (id) => {
      try {
        const response = await axios.get(`${API_URL}/spotify/artist/${id}/albums`);
        return response.data;
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data.message || 'Błąd pobrania albumów artysty');
        } else if (error.request) {
          throw new Error('Brak odpowiedzi od serwera');
        } else {
          throw new Error('Błąd podczas wysyłania żądania');
        }
      }
    },
    getArtistTopTracks: async (id) => {
      try {
        const response = await axios.get(`${API_URL}/spotify/artist/${id}/top-tracks`);
        return response.data;
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data.message || 'Błąd pobrania utworów artysty');
        } else if (error.request) {
          throw new Error('Brak odpowiedzi od serwera');
        } else {
          throw new Error('Błąd podczas wysyłania żądania');
        }
      }
    },
    search: async (query) => {
      try {
        const response = await axios.get(`${API_URL}/spotify/search`, {
          params: {query:query},
        });
        return response.data;
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data.message || 'Błąd wyszukiwania');
        } else if (error.request) {
          throw new Error('Brak odpowiedzi od serwera');
        } else {
          throw new Error('Błąd podczas wysyłania żądania');
        }
      }
    }
};