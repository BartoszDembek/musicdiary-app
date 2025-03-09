import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://musicdiary-backend-puce.vercel.app'

export const reviewService = {
  saveReview: async (userId,spotifyId,text,types,rating) => {
    try {
      // const key = `${type}_${itemId}`;
      // await AsyncStorage.setItem(key, JSON.stringify(review));
      // return true;

      const response = await axios.post(`${API_URL}/review/${userId}`, {
        spotifyId:spotifyId,text:text,types:types,rating:rating
      });

      return response.data;
    } catch (error) {
      console.error('Error saving review:', error);
      return false;
    }
  },

  getReview: async (itemId, type) => {
    try {
      const key = `${type}_${itemId}`;
      const review = await AsyncStorage.getItem(key);
      return review ? JSON.parse(review) : null;
    } catch (error) {
      console.error('Error getting review:', error);
      return null;
    }
  }
};
