import axios from 'axios';
import { API_URL } from '../config/api';

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
        const url = `${API_URL}/auth/login`;
        console.log('Sending request to:', url);
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