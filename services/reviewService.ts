import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://musicdiary-backend-puce.vercel.app'

export const reviewService = {
  saveReview: async (userId,spotifyId,text,types,rating,artistName,itemName) => {
    try {
      // const key = `${type}_${itemId}`;
      // await AsyncStorage.setItem(key, JSON.stringify(review));
      // return true;

      const response = await axios.post(`${API_URL}/review/${userId}`, {
        spotifyId:spotifyId,
        text:text,
        types:types,
        rating:rating,
        artistName:artistName,
        itemName:itemName
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
  },

  getReviewsBySpotifyId: async (spotifyId, type) => {
    try {
      const response = await axios.get(`${API_URL}/review/${spotifyId}?type=${type}`);
      return response.data;
    } catch (error) {
      console.error('Error getting reviews:', error);
      return null;
    }
  },

  calculateAverageRating: (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  },

  getFeaturedReviews: async () => {
    try {
      const response = await axios.get(`${API_URL}/reviews/featured`);
      return response.data;
    } catch (error) {
      console.error('Error getting featured reviews:', error);
      return [];
    }
  }
};
