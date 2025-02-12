import axios from 'axios';
const API_URL = __DEV__ 
  ? 'http://192.168.0.2:3001'  // Zamień x.x na IP z Expo Dev Tools
  : 'https://twoj-produkcyjny-url.com';
export const spotifyService = {
    loadAlbums: async () => {
      try {
        const response = await axios.get(`${API_URL}/spotify/newReleases`);
        return response.data;
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data.message || 'Błąd rejestracji');
        } else if (error.request) {
          throw new Error('Brak odpowiedzi od serwera');
        } else {
          throw new Error('Błąd podczas wysyłania żądania');
        }
      }
    }
};