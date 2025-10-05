import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/userService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      const profileData = await AsyncStorage.getItem('userProfile');
      
      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (profileData) {
        setUserProfile(JSON.parse(profileData));
      }
      setUserToken(token);
    } catch (error) {
      console.error('Failed to get auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token, userData) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUserToken(token);
      setUser(userData);

      // Fetch and store user profile
      const profileData = await userService.getUserProfile(userData.id);
      if (profileData && profileData[0]) {
        await AsyncStorage.setItem('userProfile', JSON.stringify(profileData[0]));
        setUserProfile(profileData[0]);
      }
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  };

  const updateUserProfile = async (profileData = null) => {
    try {
      if (profileData) {
        // If profileData is provided, use it directly
        await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
        setUserProfile(profileData);
      } else {
        // If no profileData provided, fetch from server
        if (user?.id) {
          const freshProfileData = await userService.getUserProfile(user.id);
          if (freshProfileData && freshProfileData[0]) {
            await AsyncStorage.setItem('userProfile', JSON.stringify(freshProfileData[0]));
            setUserProfile(freshProfileData[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error updating profile data:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData', 'userProfile']);
      setUserToken(null);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error removing auth data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoading,
      userToken,
      user,
      userProfile,
      signIn,
      signOut,
      updateUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
