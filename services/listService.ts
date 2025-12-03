import axios from 'axios';

const API_URL = 'https://musicdiary-backend-puce.vercel.app';

export const listService = {
  createList: async (userId, title, description, isPublic) => {
    try {
      const response = await axios.post(`${API_URL}/lists`, {
        userId,
        title,
        description,
        isPublic
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Błąd podczas tworzenia listy');
      } else if (error.request) {
        throw new Error('Brak odpowiedzi od serwera');
      } else {
        throw new Error('Błąd podczas wysyłania żądania');
      }
    }
  },

  getUserLists: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/lists/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user lists:', error);
      // Return empty array instead of throwing to avoid crashing UI on missing endpoint
      return []; 
    }
  },

  searchLists: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/lists/search?query=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching lists:', error);
      return [];
    }
  },

  getListDetails: async (listId) => {
    try {
      const response = await axios.get(`${API_URL}/lists/${listId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Błąd pobierania szczegółów listy');
      }
      throw new Error('Błąd połączenia');
    }
  },

  addListItem: async (listId, item) => {
    try {
      const response = await axios.post(`${API_URL}/lists/${listId}/items`, item);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Błąd dodawania elementu');
      }
      throw new Error('Błąd połączenia');
    }
  },

  removeListItem: async (listId, itemId) => {
    try {
      const response = await axios.delete(`${API_URL}/lists/${listId}/items/${itemId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Błąd usuwania elementu');
      }
      throw new Error('Błąd połączenia');
    }
  },

  deleteList: async (listId) => {
    try {
      const response = await axios.delete(`${API_URL}/lists/${listId}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Błąd usuwania listy');
      }
      throw new Error('Błąd połączenia');
    }
  },

  updateList: async (listId, data) => {
    try {
      const response = await axios.put(`${API_URL}/lists/${listId}`, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Błąd aktualizacji listy');
      }
      throw new Error('Błąd połączenia');
    }
  },

  updateListItemsOrder: async (listId, items) => {
    try {
      const response = await axios.put(`${API_URL}/lists/${listId}/items/reorder`, { items });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Błąd aktualizacji kolejności');
      }
      throw new Error('Błąd połączenia');
    }
  }
};
