import axios from 'axios';
const API_URL = "https://musicdiary-backend-git-dev-sh8drs-projects.vercel.app"

export const userService = {
    getUserProfile: async (userId) => {
        try {
            const response = await axios.get(`https://musicdiary-backend-git-dev-sh8drs-projects.vercel.app/user/${userId}`);
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