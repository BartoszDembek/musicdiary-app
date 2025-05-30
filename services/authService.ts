import axios from 'axios';
const API_URL = 'https://musicdiary-backend-puce.vercel.app'

export const authService = {
    register: async (userData) => {
      try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
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
    },

    login: async(userData) => {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, userData);
        return response.data;
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data.message || 'Błąd logowania');
        } else if (error.request) {
          throw new Error('Brak odpowiedzi od serwera');
        } else {
          throw new Error('Błąd podczas wysyłania żądania');
        }
      }
    },

    resendVerificationEmail: async(email:string) => {
      try {
        await axios.post(`${API_URL}/auth/resend`, email);
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data.message || '');
        } else if (error.request) {
          throw new Error('Brak odpowiedzi od serwera');
        } else {
          throw new Error('Błąd podczas wysyłania żądania');
        }
      
      }
    }
};