import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from '../../screens/ProfileScreen';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../services/userService');
jest.mock('../../context/AuthContext');
jest.mock('../../components/RecentActivity', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Recent Activity</Text></View>;
});
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));

describe('ProfileScreen', () => {
  const mockSignOut = jest.fn();
  const mockUser = { id: 1 };
  const mockUserProfile = {
    username: 'TestUser',
    created_at: '2023-01-01',
    follows: [{ follow: [] }],
    reviews: [],
    favorites: [{ favorite: [] }],
    followers: [],
  };

  beforeEach(() => {
    useAuth.mockReturnValue({
      signOut: mockSignOut,
      user: mockUser,
      userProfile: mockUserProfile,
    });
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );
    
    expect(getByText('Profile')).toBeTruthy();
    expect(getByText('TestUser')).toBeTruthy();
    expect(getByText('Joined: January 2023')).toBeTruthy();
    expect(getByText('Recent Activity')).toBeTruthy();
  });

  it('opens settings modal', () => {
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );
    
    fireEvent.press(getByTestId('settings-button'));
    
    expect(getByText('Edit Profile')).toBeTruthy();
    expect(getByText('Sign Out')).toBeTruthy();
  });

  it('handles logout', async () => {
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );
    
    fireEvent.press(getByTestId('settings-button'));
    fireEvent.press(getByText('Sign Out'));
    
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
